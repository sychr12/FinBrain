package com.finbrain.backend.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    public void enviarCodigo(String para, String codigo) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            Context context = new Context();
            context.setVariable("codigo", codigo);

            String htmlContent = templateEngine.process("email-verificacao", context);

            helper.setTo(para);
            helper.setSubject("Codigo de Verificacao - FinBrain");
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            logger.info("Email de verificacao enviado para {}", para);
        } catch (Exception e) {
            logger.warn("Nao foi possivel enviar email para {}. Codigo de verificacao: {}", para, codigo, e);
        }
    }
}
