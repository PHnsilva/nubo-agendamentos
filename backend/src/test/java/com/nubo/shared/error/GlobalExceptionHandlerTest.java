package com.nubo.shared.error;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.mock.http.MockHttpInputMessage;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GlobalExceptionHandlerTest {
  @Test
  void mapsUnreadableRequestBodyToBadRequest() {
    GlobalExceptionHandler handler = new GlobalExceptionHandler();
    MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/appointments");

    var response = handler.unreadableBody(new HttpMessageNotReadableException("invalid", new MockHttpInputMessage(new byte[0])), request);

    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertEquals("Corpo da requisição inválido ou incompatível.", response.getBody().message());
  }
}
