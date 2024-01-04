---
title: "GitHub Secrets Scanning and Push Prevention"
description: "GitHub's code scanning feature is now available. I strongly recommend checking it out."
date: 2024-01-04T08:00:00+02:00
draft: false
tags: ["GitHub"]
categories: ["GitHub"]
---

The risk of inadvertently including secrets in your Git repository has significantly increased in recent years. `GitGuardian`, a company providing solutions to prevent secret leakage in repositories, reports astonishing numbers regarding the quantity of secrets leaked in Git repositories. [State of Secrets Sprawl Report 2023](https://www.gitguardian.com/state-of-secrets-sprawl-report-2023)

![More than 10 million secrets leaked, and the number raises every year](../images/secrets-some-numbers.png)

***Figure 1:*** *More than 10 million secrets leaked, and the number raises every year*

This rise is likely due to the increased use of cloud services and the growing number of services requiring token access. Developers often store these secrets in configuration files, or worse **hard-code them in the source code for convenience**. GitHub offers automatic features to mitigate this issue, and these solution are free for public repositories. Thus, there's no reason not to have them enabled in all your repositories.

![GitHub has an option to scan repositories for secrets and also prevent push](../images/push-secrets-prevention.png)

***Figure 2:*** *GitHub has an option to scan repositories for secrets and also prevent push*

**Receiving immediate notifications from GitHub when a secret is found in your code is crucial.** Quick notification allows you to disable and rotate the secret, minimizing risk. This is the reason why GitHub introduced lots of time ago **Secrets Scanning feature**.

However, once a secret is leaked it **is imperative that you consider it compromised, so you need to immediately disable and reconfigure every service that is using it**. Since this is really annoying and you need to proceed with great haste, GitHub introduced `push protection.` to scan your commit during push and entirely prevent the push.

The list of supported services is continuously expanding, offering protection for an increasing number of services. You can find more details on the [GitHub Documentation Page](https://docs.github.com/en/code-security/secret-scanning/secret-scanning-patterns#supported-secrets).

Figure 3 demonstrates push prevention in action. GitHub blocks a push if it detects a secret in one of the commits, ensuring the secret never reaches your repository.

![Push prevention in action. Push is blocked due to a secret contained in a commit](../images/push-rejected.png)

***Figure 3:*** *Push prevention in action. Push is blocked due to a secret contained in a commit*

As shown in the picture, GitHub provides extensive information, including the commit containing the secret and the file where it's located. It also **offers a URL to authorize the push of the secret in case that secrets really needs to be in the commit**. After all there are legitimate reasons why something that seems a secret can be contained in code, so you should always be offered a way to bypass the protection.

![You can always override push protection specifying why you believe that the secret can be safely pushed](../images/override-push-protection.png)

***Figure 4:*** *You can always override push protection specifying why you believe that the secret can be safely pushed*

Bypassing push protection **does not negate other checks.** If GitHub detects a secret in your repository, it will **immediately send you a mail detailing the detected secret and a page with all the details.** Additionally, if the secret is a GitHub secret, it's immediately revoked to minimize risk. 

![Allowing the secret to be pushed does not bypass other controls, if GitHub find a GH secret it will immediately revoke it](../images/secret-revoked.png)

***Figure 5:*** *Allowing the secret to be pushed does not bypass other controls; if GitHub finds a GH secret, it will immediately revoke it*

So, push protection is an additional layer of security, preventing your secrets from reaching either public or shared private repositories. However, if this protection is not enabled, other safeguards still apply. But since **intervention after a secret leak is painful, it is crucial that you use push protection in every public repository**. Leaking a secret in a private repository is bad, but at least probably all the people that have read access to the repository are usually trusted, but losing a secret in a public repository is a real disaster.

Happy GitHub.

Gian Maria.

