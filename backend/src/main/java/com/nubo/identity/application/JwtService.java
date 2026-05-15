package com.nubo.identity.application;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nubo.identity.domain.model.User;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private static final String HMAC_ALGORITHM = "HmacSHA256";

  private final JwtProperties properties;
  private final ObjectMapper objectMapper;

  public JwtService(JwtProperties properties, ObjectMapper objectMapper) {
    this.properties = properties;
    this.objectMapper = objectMapper;
  }

  public String generateToken(User user) {
    Instant now = Instant.now();
    Map<String, Object> header = Map.of("alg", "HS256", "typ", "JWT");
    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put("sub", user.getEmail());
    payload.put("name", user.getName());
    payload.put("role", user.getRole());
    payload.put("iat", now.getEpochSecond());
    payload.put("exp", now.plusSeconds(properties.expirationMinutes() * 60).getEpochSecond());

    String unsigned = base64Json(header) + "." + base64Json(payload);
    return unsigned + "." + sign(unsigned);
  }

  public boolean isValid(String token) {
    try {
      String[] parts = token.split("\\.");
      if (parts.length != 3) return false;
      String unsigned = parts[0] + "." + parts[1];
      if (!MessageDigest.isEqual(sign(unsigned).getBytes(StandardCharsets.UTF_8), parts[2].getBytes(StandardCharsets.UTF_8))) {
        return false;
      }
      Map<String, Object> payload = payload(token);
      Number exp = (Number) payload.get("exp");
      return exp != null && Instant.now().getEpochSecond() < exp.longValue();
    } catch (Exception exception) {
      return false;
    }
  }

  public String subject(String token) {
    return (String) payload(token).get("sub");
  }

  private Map<String, Object> payload(String token) {
    try {
      String[] parts = token.split("\\.");
      byte[] json = Base64.getUrlDecoder().decode(parts[1]);
      return objectMapper.readValue(json, new TypeReference<>() {});
    } catch (Exception exception) {
      throw new IllegalArgumentException("Token inválido.", exception);
    }
  }

  private String base64Json(Object value) {
    try {
      return Base64.getUrlEncoder().withoutPadding().encodeToString(objectMapper.writeValueAsBytes(value));
    } catch (Exception exception) {
      throw new IllegalStateException("Não foi possível gerar o token.", exception);
    }
  }

  private String sign(String value) {
    try {
      Mac mac = Mac.getInstance(HMAC_ALGORITHM);
      mac.init(new SecretKeySpec(properties.secret().getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM));
      return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    } catch (Exception exception) {
      throw new IllegalStateException("Não foi possível assinar o token.", exception);
    }
  }
}
