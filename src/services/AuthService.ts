import { signInWithEmailAndPassword, UserCredential, Auth } from "firebase/auth"

class AuthService {
    private readonly auth: Auth

    constructor(auth: Auth) {
        this.auth = auth
    }

    login(email: string, pass: string): Promise<UserCredential> {
        return signInWithEmailAndPassword(this.auth, email, pass)
    }
}

export default AuthService