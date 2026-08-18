package com.example.Lifelink.Security;

import com.example.Lifelink.Auth.AuthUtil;
import com.example.Lifelink.Entity.User;
import com.example.Lifelink.Repository.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final AuthUtil authUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authorizationHeader =
                request.getHeader("Authorization");

        // No JWT → continue normally
        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        final String token =
                authorizationHeader.substring(7);

        try {

            String username =
                    authUtil.getUsernamefromToken(token);

            if (username != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                User user = userRepository
                        .findByUsername(username)
                        .orElse(null);

                if (user == null) {

                    response.setStatus(
                            HttpServletResponse.SC_UNAUTHORIZED
                    );

                    return;
                }

                System.out.println("=================================");
                System.out.println("JWT USERNAME: " + username);
                System.out.println("USER ID: " + user.getUserId());
                System.out.println("USER ROLES: " + user.getRole());
                System.out.println("AUTHORITIES: " + user.getAuthorities());
                System.out.println("REQUEST: " + request.getRequestURI());
                System.out.println("=================================");

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                user.getAuthorities()
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

            filterChain.doFilter(request, response);

        } catch (JwtException | IllegalArgumentException exception) {

            System.out.println(
                    "Invalid or expired JWT: " +
                            exception.getMessage()
            );

            SecurityContextHolder.clearContext();

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );
        }
    }
}