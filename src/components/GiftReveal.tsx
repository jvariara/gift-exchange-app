import React, { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Gift, GiftPhoto, ThankYouNote, User } from "@prisma/client"
import { Camera, Gift as GiftIcon, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

interface GiftRevealProps {
  gift: Gift & {
    giver: Pick<User, "id" | "name" | "avatar">
    receiver: Pick<User, "id" | "name" | "avatar">
    photos: GiftPhoto[]
    thankYouNotes: (ThankYouNote & {
      user: Pick<User, "id" | "name" | "avatar">
    })[]
  }
  onAddPhoto: (url: string, caption?: string) => void
  onAddThankYouNote: (content: string) => void
  currentUserId: string
}

export function GiftReveal({ gift, onAddPhoto, onAddThankYouNote, currentUserId }: GiftRevealProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isOpening, setIsOpening] = useState(false)

  useEffect(() => {
    if (!gift.revealDate) return

    const calculateTimeLeft = () => {
      const difference = new Date(gift.revealDate).getTime() - new Date().getTime()
      return Math.max(0, Math.floor(difference / 1000))
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)
      if (remaining === 0) {
        setIsRevealed(true)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [gift.revealDate])

  const formatTimeLeft = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    const remainingSeconds = seconds % 60

    return {
      days,
      hours,
      minutes,
      seconds: remainingSeconds,
    }
  }

  const handleOpenGift = () => {
    setIsOpening(true)
    // Simulate opening animation
    setTimeout(() => {
      setIsOpening(false)
    }, 2000)
  }

  const time = formatTimeLeft(timeLeft)
  const isReceiver = gift.receiverId === currentUserId
  const isGiver = gift.giverId === currentUserId

  if (!isRevealed) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-2">
            <GiftIcon className="h-6 w-6" />
            <span>Gift Reveal Countdown</span>
          </CardTitle>
          <CardDescription className="text-center">
            Your gift will be revealed in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{time.days}</div>
              <div className="text-sm text-muted-foreground">Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{time.hours}</div>
              <div className="text-sm text-muted-foreground">Hours</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{time.minutes}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{time.seconds}</div>
              <div className="text-sm text-muted-foreground">Seconds</div>
            </div>
          </div>
          <Progress
            value={(timeLeft / (24 * 60 * 60)) * 100}
            className="mt-4"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Gift</span>
          {isReceiver && !isOpening && (
            <Button onClick={handleOpenGift}>Open Gift</Button>
          )}
        </CardTitle>
        <CardDescription>
          From {gift.giver.name} to {gift.receiver.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isOpening ? (
          <div className="flex h-48 items-center justify-center">
            <GiftIcon className="h-16 w-16 animate-bounce" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Photos</h3>
              {gift.photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {gift.photos.map((photo) => (
                    <div key={photo.id} className="relative aspect-square">
                      <img
                        src={photo.url}
                        alt={photo.caption || "Gift photo"}
                        className="rounded-lg object-cover"
                      />
                      {photo.caption && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No photos yet</p>
              )}
              {isReceiver && (
                <Button variant="outline" size="sm">
                  <Camera className="mr-2 h-4 w-4" />
                  Add Photo
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Thank You Notes</h3>
              {gift.thankYouNotes.length > 0 ? (
                <div className="space-y-4">
                  {gift.thankYouNotes.map((note) => (
                    <div key={note.id} className="flex items-start space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={note.user.avatar || undefined} />
                        <AvatarFallback>
                          {note.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{note.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {note.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No thank you notes yet
                </p>
              )}
              {isReceiver && (
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Thank You Note
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 