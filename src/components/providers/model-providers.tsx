"use client"

import React, { useEffect, useState } from 'react'
import CreateServerModel from "@/components/models/CreateServerModel"
import InvitePeople from "@/components/models/InvitePeople"
import EditServer from "@/components/models/EditServer"
import CreateChannel from "@/components/models/CreateChannel"
import ManagerMemberModel from "@/components/models/ManagerMemberModel"
import DeleteServerModel from "@/components/models/DeleteServer"
import LeaveServerModel from "@/components/models/LeaveServerModel"
import EditChannel from "@/components/models/EditChannelModel"
import DeleteChannelModel from "@/components/models/DeleteChannelModel"
function ModelProviders() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <>
    <CreateServerModel />
    <InvitePeople />
    <EditServer />
    <CreateChannel />
    <ManagerMemberModel />
    <DeleteServerModel/>
    <LeaveServerModel />
    <EditChannel />
    <DeleteChannelModel />

    
    </>
  )
}

export default ModelProviders