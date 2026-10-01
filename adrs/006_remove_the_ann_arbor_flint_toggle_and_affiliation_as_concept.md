# Remove affiliation as a concept

## Context

In the past users have been able to click on a toggle button in the upper right
corner to set their `affiliation` to Ann Arbor or Flint. This would set their
default library scope for catalog searches to either "Ann Arbor Libraries" or
"Flint Thompson Libraries". If the user selected Flint this would put banners
on the page encouraging the user to use Flint's library discovery system.

In the even futher past, the `affiliation` would affect which proxy the user
would be sent to for articles. This hasn't been the case since the creation of
the Traffic Cop, which handles logging in the user appropriatedly. This was the
main use case for having the toggle.

The default library scope and whether to show Flint related messages is still
handled by the campus parameter in the session. Campus is set based on I.P.
Address for a not-logged-in user, and from the Alma account for a logged in
user.  

## Decision

We will remove the Ann Arbor / Flint Toggle and `affiliation` as a concept.

## Status

| Date       | Summary |
|------------|---------|
| 2026-09-30 | Approved  |

## Consequences

1. `affiliation` does not exist has a concept in the codebase
2. There isn't confusion about the difference between `affiliation` and `campus`
3. There is no Ann Arbor / Flint Toggle
4. Users do not have a way override their IP or Alma account based default
   settings
