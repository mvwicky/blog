---
# cSpell:disable
title: A New Links Post
description: A New Links Post
tags:
  - links
links:
  capitalb:
    title: Many newsrooms are now capitalizing the B in Black.
    author: Kristen Hare
    href: "https://www.poynter.org/reporting-editing/2020/many-newsrooms-are-now-capitalizing-the-b-in-black-here-are-some-of-the-people-who-made-that-happen/"
  uighurs:
    title: China cuts Uighur births with IUDs, abortion, sterilization
    author: The Associated Press
    href: "https://apnews.com/269b3de1af34e17c1941a514f78d764c"
  ntsb:
    title: The 3 Weeks That Changed Everything
    author: James Fallows
    href: "https://www.theatlantic.com/politics/archive/2020/06/how-white-house-coronavirus-response-went-wrong/613591/"
  police:
    title: What the police really believe
    author: Zack Beauchamp
    href: "https://www.vox.com/policy-and-politics/2020/7/7/21293259/police-racism-violence-ideology-george-floyd"
  jkrowling:
    title: J.K. Rowling and the Limits of Imagination
    author: Nathan J. Robinson
    href: "https://www.currentaffairs.org/2020/07/jk-rowling-and-the-limits-of-imagination"
# cSpell:enable
---

{% from "link_macro.njk" import link_section %}

{% call link_section(links.capitalb) %}
{% proofText 1,3 %}
{% endcall %}

{% call link_section(links.uighurs) %}
{% proofText 2 %}
{% endcall %}

{% call link_section(links.ntsb) %}
{% proofText 2 %}
{% endcall %}

{% call link_section(links.police) %}
{% proofText 2,3 %}
{% endcall %}

{% call link_section(links.jkrowling) %}
{% proofText 2,3 %}
{% endcall %}
