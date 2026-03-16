"use client"

import { useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { useConvexAuth, useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

export function useStoreUser() {
  const { isAuthenticated } = useConvexAuth()
  const { user: clerkUser } = useUser()
  const createUser = useMutation(api.users.createUser)
  const createAttempted = useRef(false)

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    isAuthenticated && clerkUser?.id ? { clerkId: clerkUser.id } : "skip"
  )

  useEffect(() => {
    if (!isAuthenticated || !clerkUser) return
    if (convexUser === undefined) return
    if (convexUser !== null) return
    if (createAttempted.current) return

    const primaryEmail =
      clerkUser.primaryEmailAddress?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress
    if (!primaryEmail) return

    createAttempted.current = true
    void createUser({
      email: primaryEmail,
      clerkId: clerkUser.id,
      name: clerkUser.fullName ?? undefined,
    }).catch(() => {
      createAttempted.current = false
    })
  }, [isAuthenticated, clerkUser, convexUser, createUser])

  return convexUser
}
