import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { CefrLevel } from "../../types/learning";
import { auth, googleProvider } from "./config";
import { formatFirebaseAuthErrorVi } from "./errors";
import { firestoreService } from "./firestoreService";

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  targetCefr: CefrLevel;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export const authService = {
  subscribeAuthState(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  async signInWithEmail(payload: SignInPayload): Promise<User> {
    if (!payload.email.trim() || !payload.password) {
      throw new Error("Vui lòng nhập đầy đủ email và mật khẩu.");
    }
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        payload.email.trim(),
        payload.password
      );
      await firestoreService.ensureUserProfile(credential.user);
      return credential.user;
    } catch (error) {
      throw new Error(formatFirebaseAuthErrorVi(error));
    }
  },

  async registerWithEmail(payload: RegisterPayload): Promise<User> {
    const cleanName = payload.fullName.trim();
    const cleanEmail = payload.email.trim();
    if (!cleanName || !cleanEmail || payload.password.length < 6) {
      throw new Error(
        "Vui lòng nhập họ tên, email hợp lệ và mật khẩu tối thiểu 6 ký tự."
      );
    }
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        payload.password
      );
      await updateProfile(credential.user, { displayName: cleanName });
      await firestoreService.ensureUserProfile(credential.user, {
        fullName: cleanName,
        targetCefr: payload.targetCefr,
      });
      return credential.user;
    } catch (error) {
      throw new Error(formatFirebaseAuthErrorVi(error));
    }
  },

  async signInWithGoogle(): Promise<User> {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      await firestoreService.ensureUserProfile(credential.user);
      return credential.user;
    } catch (error) {
      throw new Error(formatFirebaseAuthErrorVi(error));
    }
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },
};
