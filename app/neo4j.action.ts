"use server"

import { driver } from "@/db"
import type { Neo4JUSER } from "@/types"
import neo4j from 'neo4j-driver';



export const getUserByID = async (id: string) => {
  const result = await driver.executeQuery(`MATCH(u:User{  applicationId:$applicationId}) RETURN u`,
    { applicationId: id }


  )

  const users = result.records.map((record) => record.get("u").properties)
  if (users.length === 0) return null
  return users[0] as Neo4JUSER



}


export const createUser = async (user: Neo4JUSER) => {
  const { applicationId, email, firstName, lastName } = user
  await driver.executeQuery(`CREATE (u:User{ applicationId:$applicationId , firstName:$firstName, lastName:$lastName}) `, {
    applicationId,
    firstName,
    lastName,
    email
  })
}



export const getUsersWithNoConnection = async (id: string) => {
  const result = await driver.executeQuery(`MATCH (cu:User{ applicationId:$applicationId}) MATCH(ou:User) WHERE NOT(cu)-[:LIKE | :DISLIKE ]->(ou) AND cu <> ou RETURN ou`, {
    applicationId: id
  })

  const users = result.records.map((record) => record.get("ou").properties)

  return users as Neo4JUSER[]

}


// export const getUsersWithNoConnection = async (id: string) => {
//   try {
//     const result = await driver.executeQuery(
//       `MATCH (cu:User {applicationId: $applicationId}) 
//        MATCH (ou:User) 
//        WHERE NOT (cu)-[:LIKE|:DISLIKE]->(ou) AND cu <> ou 
//        RETURN ou`,
//       {
//         applicationId: id
//       }
//     );

//     const users = result.records.map((record) => record.get("ou").properties);

//     return users as Neo4JUSER[];
//   } catch (error) {
//     console.error('Error fetching users with no connection:', error);
//     throw error; // rethrow the error after logging it
//   }
// };


export const neo4jSwipe = async (
  id: string,
  swipe: string,
  userId: string
) => {

  const type = swipe === "left" ? "DISLIKE" : "LIKE"
  await driver.executeQuery(`MATCH (cu:User { applicationId: $id}), (ou:User { applicationId: $userId}) CREATE  (cu)-[:${type}]->(ou)`, {
    id,
    userId,

  })

  if (type === "LIKE") {
    const result = await driver.executeQuery(
      `MATCH (cu:User { applicationId: $id}), (ou:User{ applicationId:$userId})  WHERE (ou)-[:LIKE]->(cu) RETURN ou as match`,
      {
        id
      }
    )
    const matches = result.records.map((record) => record.get("match").properties
    );
    return Boolean(matches.length > 0)


  }






}



export const getMatches =async (currentUserId:string)=>{
  const result =await driver.executeQuery(
    `MATCH (cu:User { applicationId: $id})-[:LIKE]->(ou:User)-[:LIKE]->(cu) RETURN as a match`,
    {id: currentUserId }
  )

  const matches =result.records.map((record) => record.get("match").properties);
  return matches as Neo4JUSER[]

}