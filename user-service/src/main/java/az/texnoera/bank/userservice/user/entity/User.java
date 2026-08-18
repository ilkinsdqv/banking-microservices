package az.texnoera.bank.userservice.user.entity;

import az.texnoera.bank.common.persistence.BaseEntity;
import az.texnoera.bank.userservice.user.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SoftDelete;
import org.hibernate.annotations.SoftDeleteType;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@SoftDelete(
        strategy = SoftDeleteType.DELETED,
        columnName = "deleted"
)
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();

    @Column(nullable = false, length = 7, unique = true)
    private String fin;

    @Column(nullable = false, length = 20)
    private String phoneNumber;

    @Column(nullable = false)
    private LocalDate birthDate;


    @Column(nullable = false)
    private boolean emailVerified = false;

    @Column(nullable = false)
    private boolean accountLocked = false;

    @Column(nullable = false)
    private boolean enabled = true;

    public User(
            String firstName,
            String lastName,
            String email,
            String password,
            Set<Role> roles,
            String fin,
            String phoneNumber,
            LocalDate birthDate
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.roles = roles != null ? new HashSet<>(roles) : new HashSet<>();
        this.fin = fin;
        this.phoneNumber = phoneNumber;
        this.birthDate = birthDate;

        this.enabled = true;
        this.emailVerified = false;
        this.accountLocked = false;
    }

    public void updateProfile(String firstName, String lastName, String phoneNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
    }
}
