package com.finbrain.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import jakarta.mail.internet.MimeMessage;
import java.util.Objects;

import static java.util.Objects.requireNonNull;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine templateEngine;

    public void enviarCodigo(String para, String codigo) {
        try {
            requireNonNull(para, "Destino (para) nao pode ser nulo");
            requireNonNull(codigo, "Codigo nao pode ser nulo");
            System.out.println("\n╔════════════════════════════════════════════════════════╗");
            System.out.println("║              CODIGO DE VERIFICACAO                      ║");
            System.out.println("╠════════════════════════════════════════════════════════╣");
            System.out.printf("║ Email: %-40s ║%n", para);
            System.out.printf("║ Codigo: %-40s ║%n", codigo);
            System.out.println("╚════════════════════════════════════════════════════════╝\n");
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            Context context = new Context();
            context.setVariable("codigo", codigo);
            
            String htmlContent = templateEngine.process("email-verificacao", context);

            // Ensure htmlContent is non-null to satisfy helper API null-safety
            requireNonNull(htmlContent, "Rendered email template returned null");

            // Use String[] to match the helper signature and avoid unchecked conversion warnings
            helper.setTo(new String[]{para});
            helper.setSubject("Codigo de Verificacao - FinBrain");
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            
            System.out.println("Email enviado com sucesso para: " + para);
            
        } catch (Exception e) {
            System.err.println("Erro ao enviar email: " + e.getMessage());
            System.err.println("\n>>> USE O CODIGO PARA CONFIRMAR: " + codigo);
        }
    }

    public void enviarEmail(String email, String subject, String mensagemEmail) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(new String[]{email});
            helper.setSubject(subject);
            helper.setText(mensagemEmail, true);

            mailSender.send(mimeMessage);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar email: " + e.getMessage());
        }
    }
}