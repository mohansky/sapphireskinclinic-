import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const siteCollection = defineCollection({
  loader: file("src/content/site/index.yml"),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tagline: z.string(),
      title: z.string(),
      description: z.string(),
      basepath: z.string(),
      ogImageURL: z.string(),
      keywords: z.array(z.string()),
      author: z.object({
        name: z.string(),
        email: z.string().email(),
        url: z.string().url(),
      }),
      hero: z.array(
        z.object({
          title: z.string(),
          subtitle: z.string().optional(),
          isFirstSlide: z.boolean().optional().default(false),
          backgroundImage: image(),
          overlayOpacity: z.number().optional(),
          primaryButtonText: z.string().optional(),
          primaryButtonLink: z.string().optional(),
          secondaryButtonText: z.string().optional(),
          secondaryButtonLink: z.string().optional(),
        })
      ),
      heroPage: z.array(
        z.object({
          title: z.string(),
          slug: z.string(),
          subtitle: z.string().optional(),
          img: image(),
          overlayOpacity: z.number().optional(),
        })
      ),
      offers: z.array(
        z.object({
          title: z.string().optional().nullable(),
          subtitle: z.string().optional().nullable(),
          image: image(),
          offerImg: image(),
        })
      ),
      about: z.object({
        description: z.string(),
        mission: z.string(),
        vision: z.string(),
      }),
      values: z.array(z.string()),
      aboutTitle: z.string(),
      aboutText: z.string(),
      aboutImage: image(),
      highlights: z.array(
        z.object({
          number: z.string(),
          title: z.string(),
          icon: z.string(),
        })
      ),
      testimonials: z.array(
        z.object({
          number: z.string(),
          text: z.string(),
          patient: z.string(),
          rating: z.number(),
        })
      ),
      footerBookAppointment: z.object({
        title: z.string(),
        btnLink: z.string(),
        btnText: z.string(),
      }),
      footerLatestOffers: z.object({
        title: z.string(),
        subtitle: z.string(),
        bgImage: image(),
        offerImg: image(),
        btnLink: z.string(),
        btnText: z.string(),
      }),
      popularTreatments: z.array(
        z.object({
          name: z.string(),
          link: z.string(),
        })
      ),
      usefulLinks: z.array(
        z.object({
          name: z.string(),
          link: z.string(),
        })
      ),
      socialsTitle: z.string(),
      social_media: z.array(
        z.object({
          link: z.string().url(),
          icon: z.string(),
          text: z.string(),
        })
      ),
      copyright: z.object({
        year: z.number(),
        text: z.string(),
        footnote: z.string(),
      }),
      doctors: z.array(
        z.object({
          published: z.boolean().optional().default(true),
          name: z.string(),
          qualifications: z.string(),
          specialization: z.string(),
          image: image(),
          bio: z.string().optional(),
        })
      ),
      faq: z.array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      ),
      equipments: z.array(
        z.object({
          title: z.string(),
          image: image(),
          titleImage: image(),
          text: z.array(z.string()),
        })
      ),
      locations: z.array(
        z.object({
          title: z.string(),
          address: z.array(z.string()),
          phones: z.array(z.string()),
          email: z.string().email(),
          map: z.string(),
          timmings: z.array(
            z.object({
              title: z.string(),
              details: z.string(),
            })
          ),
        })
      ),
      navigation: z.array(
        z.object({
          text: z.string(),
          link: z.string(),
          active: z.boolean().optional().default(false),
        })
      ),
    }),
});

const aboutCollection = defineCollection({
  loader: file("src/content/about/index.yml"),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tagline: z.string(),
      aboutQuote: z.string(),
      aboutClinic: z.object({
        heading: z.string(),
        text: z.array(z.string()),
        images: z.array(image()),
      }),
      whyUs: z.object({
        heading: z.string(),
        list: z.array(z.object({ text: z.string(), icon: z.string() })),
      }),
      doctors: z.array(
        z.object({
          published: z.boolean().optional().default(true),
          name: z.string(),
          qualifications: z.string(),
          specialization: z.string(),
          image: image(),
          bio: z.string().optional(),
        })
      ),
      teamTitle: z.string(),
      teamImage: image(),
    }),
});

const treatmentsCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/treatments" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      permalink: z.string().optional(),
      draft: z.boolean().optional().default(false),
      type: z.string(),
      weight: z.number(),
      subtitle: z.string(),
      description: z.string(),
      icon: image(),
      img: image(),
      before: image().optional().nullable(),
      after: image().optional().nullable(),
    }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      permalink: z.string().optional(),
      draft: z.boolean().optional().default(false),
      type: z.string(),
      publishDate: z.date(),
      author: z.string(),
      category: z.string(),
      description: z.string(),
      img: image(),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = {
  siteCollection: siteCollection,
  treatments: treatmentsCollection,
  aboutCollection: aboutCollection,
  blog: blogCollection,
};
