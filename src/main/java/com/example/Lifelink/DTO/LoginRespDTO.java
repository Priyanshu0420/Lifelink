package com.example.Lifelink.DTO;

import com.example.Lifelink.Type.EnumRoles;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRespDTO {

    private String jwt;

    private String username;

    private Long userId;

    private Set<EnumRoles> role=new HashSet<>();
}
