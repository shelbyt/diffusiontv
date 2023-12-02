# Diffusion TV

## About
Hello! Diffusion TV is Tiktok for AI generated videos. It is a mobile first PWA application build with NextJS/Tailwind/Prisma inspired by short video platforms. This project was born out of a desire to stay on the cutting edge of AI video technology and to shine a light on the amazing work being done by many talented individuals. The best part is, it's open source so everyone can learn how to build this themselves.

<img src="https://github.com/shelbyt/diffusiontv/assets/1332316/502e611b-4c69-44fc-9918-1ad063f5d26e" width="200">
<img src="https://github.com/shelbyt/diffusiontv/assets/1332316/bf363a9f-86e5-4c68-be2b-f1de5e740dd2" width="200">



The videos and engagement data comes from Civitai, however while Civitai is a great place to share models and images, video content is underserved. I wanted a way where I could follow my favorite creators, stay on top of the latest videos, and watch videos that aren't normally surfaced on Civitai by creating a unique recommendation algorithm based on clusters of video content using [CLIP](https://arxiv.org/pdf/2103.00020.pdf) as a baseline.


> [!NOTE]
The content in DiffusionTV based 100% on [Civitai's API](https://github.com/civitai/civitai/wiki/REST-API-Reference). None of the content is scraped from their website in order to remain compliant to their Terms of Service.



| Features   | DiffusionTV |  Civitai| 
|----------------|---------|-------|
| Mobile First using PWA | ✅ |  ❌| 
| Video optimized using less memory than TikTok/Reels/Shorts Web | ✅ |  ❌| 
| HD Mobile Videos (Civitai downscales to SD)| ✅ |  ❌| 
| Recommended "Inspire" Feed | ✅ |  ❌| 
| Push notifications when artists upload to Civitai  | ⚒ |  ❌| 
| Directly upload videos  | ⚒ |  ✅| 
| Like and bookmark prompts and videos  | ✅ |  ✅| 
| 3,000+ Videos  | ✅ |  ✅| 


## Support the Project with Stars 🤩 

I am running this project out of pocket at the moment. Costs are daily transcoding, storage and serving images and videos, and CDNs for this content. If you appreciate what I'm doing start me ⭐ on GitHub, send feedback and share with friends. Thank you!

| Star Milestone  | Feature  | Status
|----------------|---------|-------|
| 0 stars          | 🎉 Serve application and open source |  ✅
| 20 stars        |  🤝 Claim profile  [^1] | 
| 25 stars        |⚡ Keep lights on for 14 days  [^2] | 
| 50 stars        | 👀 Double dataset with fewer content filters[^3]  |
| 75 stars        | ⚡Keep lights on for 30 days [^2] |
| 250 stars       | 📀Improved loading time with better trancoder and CDN [^4] |
| 500 stars       | 🚀Realtime update video and personal upload [^5] |
| 1000 stars      | 📱Create iOS + Andriod App  [^6] |
| 5000 stars      |🔥 Release my updated Civitai API for Videos[^7] |

[^1]: The next feature on the roadmap is to enable Civitai users to "claim" their profiles. This is challenging because Civitai has no "Login with Civitai". I have found a couple of ways around this to securely claim and verify ownership but it will take a couple weeks. 
[^2]: Costs include daily jobs for transcoding, serving, and recommendation algorithms. Serving video is very expensive. 
[^3]: Civitai's content filters are very aggressive and have many false positives. By loosening them I can double the video database but that also doubles costs.
[^4]: To reduce memory usage, the transcoder pipelines ensures that 90% of videos are <10MB. However, this can be reduced further and make for instant loading times. 
[^5]: At the moment the video pipeline runs daily. It would be nice to run this more frequently and enable users who are not from Civitai to directly upload videos.
[^6]: PWA's are great but there are many limitations that I had to hack for it to work and be memory efficient. A nataive app would overcome many of these issues.
[^7]: [Civitai's API is broken ](https://github.com/civitai/civitai/issues/769]), so I fixed it. 


## Techstack 
tl;dr NextJS front-end. Node and Python backend.

| Stack | Uses
|----------------|---------|
| NextJS/Typescript     | Front-end | 
| Vercel| Hosting
| TRPC | jk
| Prisma/Planetscale | Database and ORM
| NodeJs/Python | Backend
| Replicate | AI APIs
| AWS Cloudfront | CDN
| Qencode | Transcoder  
| AWS S3 | Data Hosting
| Auth | Auth0
| Civitai | Civitai APIs
| Cursor + Custom GPT4 | Code Buddy 



## License

Diffusion TV is licensed under  AGPL

---

Your support and feedback are what drive this project forward. Please star on GitHub, report issues or share your thoughts and ideas.
