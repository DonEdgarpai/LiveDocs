'use client'

import React, { ReactNode } from "react";
import{ClientSideSuspense, LiveblocksProvider} from '@liveblocks/react/suspense'
import Loader from "@/components/Loader";
import getClerkUsers, { getDocumentsUsers } from "@/lib/actions/user.actions";
import { text } from "stream/consumers";
import { useUser } from "@clerk/nextjs";

const Provider = ({children}: {children: ReactNode}) => {
const {user: clerkUser} = useUser();

  return (
    <LiveblocksProvider 
    authEndpoint="/api/liveblocks-auth"
    resolveUsers={async({ userIds }) =>{
       const users = await getClerkUsers({userIds});

       return users;
    }}
    resolveMentionSuggestions={async({ text, roomId}) => {
      const roomUsers = await getDocumentsUsers({
        roomId,
        currentUser: clerkUser?.emailAddresses[0].emailAddress!,
        text,
      })
      return roomUsers;
    }}

    >
      <ClientSideSuspense fallback={<Loader />}>
        {children}
      </ClientSideSuspense>
  </LiveblocksProvider>  
  )
}

export default Provider