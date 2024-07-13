
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import { createUser, getUserByID } from "../neo4j.action"

export default async function CallbackPage() {

    const { isAuthenticated, getUser } = getKindeServerSession()


    if (!(await isAuthenticated())) {
        return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000/callback")
    }

    const user = await getUser()

    if (!user) {
        return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000/callback")
    }

    const dbuser = await getUserByID(user.id)

    if (!dbuser) {
        //create a new user 
        await createUser({ applicationId: user.id, email: user.email!, firstName: user.given_name!, lastName: user.family_name! })




    }
   return redirect("/")


}