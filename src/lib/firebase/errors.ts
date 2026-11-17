import { auth } from "./config";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: Array<{
      providerId?: string | null;
      email?: string | null;
    }>;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };

  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function formatFirebaseAuthErrorVi(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email hoặc mật khẩu không chính xác.";
    case "auth/invalid-email":
      return "Định dạng địa chỉ email không hợp lệ.";
    case "auth/email-already-in-use":
      return "Email này đã được đăng ký tài khoản. Vui lòng chuyển sang tab Đăng nhập.";
    case "auth/weak-password":
      return "Mật khẩu quá yếu. Vui lòng chọn mật khẩu từ 6 ký tự trở lên.";
    case "auth/popup-closed-by-user":
      return "Cửa sổ đăng nhập Google đã bị đóng trước khi hoàn tất.";
    case "auth/popup-blocked":
      return "Trình duyệt đang chặn cửa sổ bật lên (pop-up). Vui lòng cho phép pop-up và thử lại.";
    case "auth/operation-not-allowed":
      return "Phương thức đăng nhập Email/Mật khẩu chưa được bật trong Firebase Console (Authentication > Sign-in method). Bạn có thể bật trong Console hoặc dùng Đăng nhập Google.";
    case "auth/too-many-requests":
      return "Bạn đã thử quá nhiều lần. Vui lòng đợi ít phút rồi thử lại.";
    case "auth/network-request-failed":
      return "Lỗi kết nối mạng tới máy chủ xác thực Firebase.";
    default:
      return error instanceof Error
        ? `Không thể xác thực Firebase: ${error.message}`
        : "Đã xảy ra lỗi xác thực Firebase.";
  }
}

export function formatFirestoreErrorVi(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("Missing or insufficient permissions")) {
      return "Không đủ quyền truy cập dữ liệu riêng tư trên Cloud Firestore.";
    }
    if (error.message.includes("the client is offline")) {
      return "Không thể kết nối Cloud Firestore (máy khách đang ngoại tuyến).";
    }
    try {
      const parsed = JSON.parse(error.message) as Partial<FirestoreErrorInfo>;
      if (parsed.error) {
        if (parsed.error.includes("Missing or insufficient permissions")) {
          return "Quyền truy cập Cloud Firestore bị từ chối cho thao tác này.";
        }
        return `Lỗi Cloud Firestore: ${parsed.error}`;
      }
    } catch {
      // Plain error message
    }
    return error.message;
  }
  return "Đã xảy ra lỗi khi đồng bộ dữ liệu Cloud Firestore.";
}
