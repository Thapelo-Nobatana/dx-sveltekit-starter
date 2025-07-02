import { prisma } from "./prisma-instance";

export class UserRoleManager {
    static getBaseOnRole(role) {
        switch (role.toLowerCase()) {
            case "admin":
                return new AdminModel();
            case "user":
                return new UserModel();
            default:
                console.error(`Unknown role: ${role}`);
                return new UserModel();
        }
    }

    static async getBasedOnId(id) {
        const userRole = await prisma.user_role.findUnique({
            where: { id }
        });
        return UserRoleManager.getBaseOnRole(userRole?.role_name);
    }
}

class UserRoleModelBase {
    getDefaultRoute() {
        return "/dashboard";
    }
}

class AdminModel extends UserRoleModelBase {}

class UserModel extends UserRoleModelBase {}