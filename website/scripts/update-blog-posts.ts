#!/usr/bin/env tsx
import { prisma } from "../prisma/prisma";

const updates = [
  {
    slug: "if-i-covered-up-your-logo",
    featuredImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=630&fit=crop&q=80",
    content: `<h2>The logo test</h2>
<p>If I covered up your logo and your competitor's, nobody could tell the difference.</p>
<p>That's not a dig at your design. It's a dig at something deeper.</p>
<p>You've got a nice website. You post on socials. Maybe you even run ads. But when someone compares you to the place down the road, what do they see?</p>
<p>Same offer. Same price point. Same "welcome to our page" energy.</p>
<p>And when you look like everyone else, people choose on price. That's a race to the bottom. One you can't win.</p>

<h2>The scary part</h2>
<p>Most businesses don't realise they're in it. They think the problem is "we need more followers" or "our Google ranking dropped." So they hire someone to fix the marketing. Post more. Spend more. Optimise more.</p>
<p>It doesn't work. Because this isn't a marketing problem. It's a brand problem.</p>
<p>Marketing is what you say. Brand is what they feel. And if they don't feel anything different about you, no amount of posts will fix it.</p>

<h2>Picture this</h2>
<p>A customer walks past three cafes on their street. Two of them have signs saying "great coffee, friendly service, free wifi." The third one has a queue out the door. Not because the coffee's better. Because everyone in that queue <strong>knows</strong> something about that place. They feel something. They'd walk past the other two to get there.</p>
<p>That's not marketing spend. That's brand.</p>

<h2>You already know</h2>
<p>And here's the thing — you already know what makes you different. You just haven't put words to it. The stories you tell your mates about why you started. The stuff you do that nobody else bothers with. The way you actually give a shit when a customer has a bad day.</p>
<p>That's your brand. Not your logo. Not your colour palette. The stuff that makes you <strong>you</strong>.</p>
<p>Most agencies skip this bit. They jump straight to the tactics. "We'll post three times a week." "We'll get you on page one." But if people land on your page and feel nothing, what's the point?</p>

<h2>How we do it</h2>
<p>We do it backwards. We figure out what makes you uncopyable first. Then we make sure everyone sees it.</p>
<p>Not everyone should work with us. If you want someone to just "manage your socials," we're probably not your people. But if you're sick of competing on price and you want to become the only choice in your category, we should talk.</p>
<p>No pitch. No pressure. Fancy a coffee and a chat?</p>
<p><strong>Drop me a message.</strong> Even if it's just to say "I think you're right but I've no idea where to start." That's the smallest yes. And it's enough.</p>`,
  },
  {
    slug: "we-turned-down-a-client",
    featuredImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop&q=80",
    content: `<h2>We said no</h2>
<p>We turned down a client last week.</p>
<p>Not because they were difficult. Not because the money wasn't there. They seemed sound, actually. Proper nice people running a proper good business.</p>
<p>We said no because they didn't have a brand problem. They had a marketing problem. And honestly? A decent freelancer could sort that for half the price.</p>

<h2>The thing most agencies won't tell you</h2>
<p>That's the thing most agencies won't tell you. Not every business needs what we do. Some just need someone to post on their socials or fix their website. That's fine. It's just not what <strong>we</strong> do.</p>
<p>We build uncopyable brands. That's it. That's the whole thing.</p>
<p>And if your problem is "we need more content," we're overkill. Like hiring an architect to put up a shelf.</p>

<h2>What most agencies do instead</h2>
<p><strong>Most agencies would take the money anyway.</strong> They'd sell you a "brand strategy" you don't need, chuck in some social media management, and call it a day. Six months later you're £5k down and nothing's changed. Because you never had a brand problem. You had a visibility problem.</p>
<p>Which is a shame, because there's nothing worse than spending money on the wrong thing.</p>

<h2>The simple test</h2>
<p>So how do you know if you've got a brand problem? Simple test.</p>
<p>If I asked ten of your customers why they choose you over the place down the road, would they all say the same thing? And would that thing be something <strong>only</strong> you can claim?</p>
<p>If the answer's no, you've got a brand problem. If the answer's "because we're cheaper" or "because we're closer," you've definitely got a brand problem. Because the day someone opens up round the corner with lower prices, you're finished.</p>

<h2>What we actually fix</h2>
<p>That's what we fix. We find the thing that makes you different. The thing nobody else can copy. Then we put words to it, show it off, and make sure everyone who should choose you actually does.</p>
<p>But like I said — not everyone needs that. And we're not going to pretend you do just to get your money.</p>

<h2>What happens next</h2>
<p>If you think you might have a brand problem, drop me a message. I'll be straight with you. If it's just a marketing thing, I'll tell you who to call instead. No catch.</p>
<p>And if it turns out you <strong>do</strong> have a brand problem? Well, we should grab a coffee. Up to you.</p>`,
  },
  {
    slug: "the-cafe-round-the-corner",
    featuredImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=630&fit=crop&q=80",
    content: `<h2>The coffee's the same</h2>
<p>The cafe round the corner doesn't have better coffee than you.</p>
<p>Their beans aren't fresher. Their barista isn't more skilled. Their flat white is probably identical to yours.</p>
<p>But they're busy. And you're not.</p>

<h2>That's backwards, isn't it?</h2>
<p>The product's the same. The price is the same. The location is basically the same. So why are people choosing them?</p>
<p>Here's what most business owners miss. Customers don't choose the best option. They choose the option they <strong>feel something about</strong>.</p>
<p>And right now, they feel nothing about you. Not because you're not good. Because they don't know what you stand for. They can't name the thing that makes you <strong>you</strong>.</p>

<h2>Which is a shame</h2>
<p>Because that thing is probably obvious to everyone who knows you.</p>
<p>The reason you started. The way you treat your regulars. The thing you do that the big chains would never bother with. That's your brand. And if you're not telling that story, nobody's hearing it.</p>

<h2>Visibility isn't the answer</h2>
<p>Most business owners think they need "more visibility." More posts. More ads. More footfall. But visibility without difference is just noise. You're basically paying to remind people that you're forgettable.</p>
<p><strong>The question isn't how do we get seen more.</strong> It's how do we make sure that when people see us, they feel something they can't feel anywhere else.</p>

<h2>Picture this</h2>
<p>Someone's scrolling on their phone. They see three businesses that do what you do. Two of them say "quality service, great prices, established 2015." The third one tells a story. A real one. About why they opened. About the time they stayed late to help a customer. About the thing they believe that nobody else does.</p>
<p>Which one gets the follow? Which one gets saved? Which one do they tell their mate about?</p>
<p>That's not a marketing trick. That's a brand, told properly.</p>

<h2>What we do</h2>
<p>We help businesses find that story. Not make one up — find the one that's already there. Then we make sure everyone sees it.</p>
<p>Not with jargon. Not with fake urgency. Just the truth, told in a way that makes people choose you specifically. Not because you're nearby. Not because you're cheap. Because you're the only one who does what you do, the way you do it.</p>

<h2>Up to you</h2>
<p>If that sounds like something your business needs, drop me a message. Or don't. Up to you. No pressure either way.</p>
<p>But if you're tired of watching the cafe round the corner take customers who should be yours, maybe it's time we had a chat.</p>`,
  },
];

async function updatePosts() {
  try {
    for (const update of updates) {
      const post = await prisma.blogPost.findUnique({
        where: { slug: update.slug },
      });

      if (!post) {
        console.log(`Post "${update.slug}" not found. Skipping.`);
        continue;
      }

      await prisma.blogPost.update({
        where: { slug: update.slug },
        data: {
          content: update.content,
          featuredImage: update.featuredImage,
        },
      });

      console.log(`✅ Updated: "${post.title}"`);
    }

    console.log("\n🎉 All blog posts updated successfully!");
  } catch (error) {
    console.error("Error updating blog posts:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updatePosts();
