package com.example.Lifelink.Service.Specification;

import com.example.Lifelink.Entity.Hospital;
import com.example.Lifelink.Entity.Patient;
import com.example.Lifelink.Type.EnumBloodGroup;
import com.example.Lifelink.Type.EnumGender;
import org.springframework.data.jpa.domain.Specification;

public class PatientSpecification {

    public static Specification<Patient> belongsToHospital(Hospital hospital) {
        return (root, query, cb) ->
                hospital == null ? null :
                        cb.equal(root.get("hospital"), hospital);
    }

    public static Specification<Patient> hasGender(EnumGender gender) {
        return (root, query, cb) ->
                gender == null ? null :
                        cb.equal(root.get("gender"), gender);
    }

    public static Specification<Patient> hasBloodGroup(EnumBloodGroup bloodGroup) {
        return (root, query, cb) ->
                bloodGroup == null ? null :
                        cb.equal(root.get("bloodGroup"), bloodGroup);
    }

    public static Specification<Patient> hasCity(String city) {
        return (root, query, cb) ->
                city == null || city.isBlank()
                        ? null
                        : cb.equal(cb.lower(root.get("city")), city.toLowerCase());
    }

    public static Specification<Patient> hasState(String state) {
        return (root, query, cb) ->
                state == null || state.isBlank()
                        ? null
                        : cb.equal(cb.lower(root.get("state")), state.toLowerCase());
    }

    public static Specification<Patient> hasCountry(String country) {
        return (root, query, cb) ->
                country == null || country.isBlank()
                        ? null
                        : cb.equal(cb.lower(root.get("country")), country.toLowerCase());
    }

    public static Specification<Patient> hasEmail(String email) {
        return (root, query, cb) ->
                email == null || email.isBlank()
                        ? null
                        : cb.equal(cb.lower(root.get("email")), email.toLowerCase());
    }
}
