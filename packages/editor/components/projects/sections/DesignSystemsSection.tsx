"use client"

import { useAddToast } from "@components/toaster/use-add-toast"
import { Button } from "@components/ui/Button"
import { Card } from "../Card"
import { Grid } from "../Grid"
import { Section } from "../Section"

export const DesignSystemsSection = () => {
  const addToast = useAddToast()
  return (
    <Section
      className="z-10"
      title="Design systems"
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
          title="Google Material 3"
          subtitle="@seldon"
          image={{
            src: "/google-material.png",
            alt: "Google Material 3",
          }}
        />
        <Card
          title="IBM Carbon"
          subtitle="@seldon"
          image={{
            src: "/ibm-carbon.png",
            alt: "IBM Carbon",
          }}
        />
        <Card
          title="Uber Base"
          subtitle="@seldon"
          image={{
            src: "/uber-base.png",
            alt: "Uber Base",
          }}
        />
        <Card
          title="Shopify Polaris"
          subtitle="@seldon"
          image={{
            src: "/shopify-polaris.png",
            alt: "Shopify Polaris",
          }}
        />
      </Grid>
    </Section>
  )
}
