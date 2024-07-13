import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation";
import { getUserByID, getUsersWithNoConnection } from "./neo4j.action";
import HomePageClinetComponent from "./components/Home";


export default async function Home() {

  const { isAuthenticated, getUser } = getKindeServerSession()


  if (!(await isAuthenticated())) {
    return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000/callback")
  }


  const user = await getUser()

  if (!user) {
    return redirect("/api/auth/login?post_login_redirect_url=http://localhost:3000/callback")
  }

  const UserWithNoConnection = await getUsersWithNoConnection(user.id)
  const currentUser = await getUserByID(user.id)





  return (
    <main>
      {currentUser && <HomePageClinetComponent currentUser={currentUser} users={UserWithNoConnection} />
      }
      {/* <h1>hi {user.family_name}</h1> */}


    </main>

  );
}
