package com.nubo.shared.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {
  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ApiError> validation(MethodArgumentNotValidException exception, HttpServletRequest request) {
    List<FieldViolation> details = exception.getBindingResult().getFieldErrors().stream()
        .map(error -> new FieldViolation(error.getField(), error.getDefaultMessage()))
        .toList();
    return error(HttpStatus.BAD_REQUEST, "Validation Error", "Dados inválidos.", request, details);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  ResponseEntity<ApiError> constraint(ConstraintViolationException exception, HttpServletRequest request) {
    List<FieldViolation> details = exception.getConstraintViolations().stream()
        .map(error -> new FieldViolation(error.getPropertyPath().toString(), error.getMessage()))
        .toList();
    return error(HttpStatus.BAD_REQUEST, "Validation Error", "Dados inválidos.", request, details);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  ResponseEntity<ApiError> unreadableBody(HttpMessageNotReadableException exception, HttpServletRequest request) {
    return error(HttpStatus.BAD_REQUEST, "Bad Request", "Corpo da requisição inválido ou incompatível.", request, List.of());
  }

  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  ResponseEntity<ApiError> typeMismatch(MethodArgumentTypeMismatchException exception, HttpServletRequest request) {
    return error(HttpStatus.BAD_REQUEST, "Bad Request", "Parâmetro inválido: " + exception.getName() + ".", request, List.of());
  }

  @ExceptionHandler(MissingServletRequestParameterException.class)
  ResponseEntity<ApiError> missingParameter(MissingServletRequestParameterException exception, HttpServletRequest request) {
    return error(HttpStatus.BAD_REQUEST, "Bad Request", "Parâmetro obrigatório ausente: " + exception.getParameterName() + ".", request, List.of());
  }

  @ExceptionHandler(BadRequestException.class)
  ResponseEntity<ApiError> badRequest(BadRequestException exception, HttpServletRequest request) {
    return error(HttpStatus.BAD_REQUEST, "Bad Request", exception.getMessage(), request, List.of());
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  ResponseEntity<ApiError> notFound(ResourceNotFoundException exception, HttpServletRequest request) {
    return error(HttpStatus.NOT_FOUND, "Not Found", exception.getMessage(), request, List.of());
  }

  @ExceptionHandler(ForbiddenOperationException.class)
  ResponseEntity<ApiError> forbidden(ForbiddenOperationException exception, HttpServletRequest request) {
    return error(HttpStatus.FORBIDDEN, "Forbidden", exception.getMessage(), request, List.of());
  }

  @ExceptionHandler(AccessDeniedException.class)
  ResponseEntity<ApiError> accessDenied(AccessDeniedException exception, HttpServletRequest request) {
    return error(HttpStatus.FORBIDDEN, "Forbidden", "Você não tem permissão para acessar este recurso.", request, List.of());
  }

  @ExceptionHandler(BadCredentialsException.class)
  ResponseEntity<ApiError> badCredentials(BadCredentialsException exception, HttpServletRequest request) {
    return error(HttpStatus.UNAUTHORIZED, "Unauthorized", "Credenciais inválidas.", request, List.of());
  }

  @ExceptionHandler(AuthenticationException.class)
  ResponseEntity<ApiError> authentication(AuthenticationException exception, HttpServletRequest request) {
    return error(HttpStatus.UNAUTHORIZED, "Unauthorized", "Autenticação obrigatória.", request, List.of());
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  ResponseEntity<ApiError> dataIntegrity(DataIntegrityViolationException exception, HttpServletRequest request) {
    return error(HttpStatus.CONFLICT, "Conflict", "Operação conflita com dados já cadastrados.", request, List.of());
  }

  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  ResponseEntity<ApiError> methodNotAllowed(HttpRequestMethodNotSupportedException exception, HttpServletRequest request) {
    return error(HttpStatus.METHOD_NOT_ALLOWED, "Method Not Allowed", "Método HTTP não permitido para este recurso.", request, List.of());
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<ApiError> unexpected(Exception exception, HttpServletRequest request) {
    log.error("Unexpected API error at {}", request.getRequestURI(), exception);
    return error(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "Erro inesperado.", request, List.of());
  }

  private ResponseEntity<ApiError> error(HttpStatus status, String error, String message, HttpServletRequest request, List<FieldViolation> details) {
    return ResponseEntity.status(status).body(ApiError.of(status.value(), error, message, request.getRequestURI(), details));
  }
}
