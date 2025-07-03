import { redirect } from "@sveltejs/kit";
import { UserRoleManager } from "$lib/server/userRoleModel.js";

/** @type {import('./$types').PageServerLoad} */
export const load = async (event) => {
    // DX-NOTE: Redirect users that land on the 'root' route ("/") to a configured default route
    const userRoleManager = await UserRoleManager.getBaseOnRole();
    redirect(301, userRoleManager.getDefaultRoute());
};
