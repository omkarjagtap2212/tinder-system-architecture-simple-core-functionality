"use client"


import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Neo4JUSER } from "@/types"
import * as React from "react"
import TinderCard from 'react-tinder-card'
import { neo4jSwipe } from "../neo4j.action"



interface HomePageClinetComponentProps {
    currentUser: Neo4JUSER
    users: Neo4JUSER[]



}


const HomePageClinetComponent: React.FC<HomePageClinetComponentProps> = ({ currentUser, users }) => {

    // const onSwipe = () => {
    //     console.log('You swiped: ')
    // }

    // const onCardLeftScreen = () => {
    //     console.log(' left the screen')
    // }
    const handleswipe = async (direction: string, userId: string) => {
        const isMatch = await neo4jSwipe(currentUser.applicationId, direction, userId)
        if (isMatch) alert("congrtas you made a match successfully")


    }


    return (
        <div className="w-screen h-screen flex justify-center items-center">

            <div>
                <div>

                    <h1 className="text-4xl">{currentUser.firstName} {currentUser.lastName} </h1>

                </div>

                <div className="mt-4 relative">
                    {users.map((card) => (
                        <TinderCard onSwipe={(direction) => handleswipe(direction, card.applicationId)} className="absolute" key={card.applicationId}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{card.firstName} {card.lastName}</CardTitle>
                                    <CardDescription>{card.email}</CardDescription>

                                </CardHeader>

                            </Card>
                        </TinderCard>

                    ))}

                </div>
            </div>

        </div>
    )
}


export default HomePageClinetComponent