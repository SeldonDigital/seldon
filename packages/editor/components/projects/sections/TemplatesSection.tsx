"use client"

import { useAddToast } from "@components/toaster/use-add-toast"
import { Button } from "@components/ui/Button"
import { Card } from "../Card"
import { Grid } from "../Grid"
import { Section } from "../Section"

export const TemplatesSection = () => {
  const addToast = useAddToast()
  return (
    <Section
      className="z-10"
      title="Templates"
      disclaimer="Coming soon"
      slots={{
        header: {
          trailing: (
            <Button
              variant="secondary"
              icon="next"
              onClick={() => {
                addToast("This feature is coming soon")
              }}
            >
              {"Browse all"}
            </Button>
          ),
        },
      }}
    >
      <Grid>
        <Card
          title="Hotel booking app"
          subtitle="@seldon"
          image={{
            src: "/hotel-booking-app.png",
            alt: "Hotel booking app",
          }}
        />
        <Card
          title="Music streaming app"
          subtitle="@seldon"
          image={{
            src: "/music-streaming-app.png",
            alt: "Music streaming app",
          }}
        />
        <Card
          title="Ecommerce website"
          subtitle="@seldon"
          image={{
            src: "/ecommerce-website.png",
            alt: "Ecommerce website",
          }}
        />
        <Card
          title="Shopping app"
          subtitle="@seldon"
          image={{
            src: "/shopping-app.png",
            alt: "Shopping app",
          }}
        />
      </Grid>
    </Section>
  )
}
