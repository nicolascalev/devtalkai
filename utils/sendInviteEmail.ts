import { Organization, User } from "@prisma/client";
import axios from "axios";

if (!process.env.BREVO_API_KEY) {
  throw new Error("BREVO_API_KEY env variable is required");
}

type InviteEmailParams = {
  user: User;
  organization: Organization;
  baseUrl: string;
  to: string;
};

function getMessage({ user, organization, baseUrl, to }: InviteEmailParams) {
  const url = baseUrl + "profile";

  return `
<!DOCTYPE html><html><body>
<p>Join ${organization.name} on devtalk ai</p>
<p>Hello,

${user.fullName} (${user.email}) has invited you
to join the organization ${organization.name} on devtalk ai.</p>

<a href="${url}">Join the organization</a>

<p>Or copy and paste this URL into your browser:
${url}</p>

<hr />

<p>This invitation was intended for ${to}. If you were not expecting this
invitation, you can ignore this email.</p>
</body></html>
`;
}

export default async function sendInviteEmail(params: InviteEmailParams) {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: "no-reply@devtalkai.com",
          name: "Devtalk ai Team",
        },
        subject: `Join ${params.organization.name} on devtalk ai`,
        htmlContent: getMessage(params),
        messageVersions: [
          {
            to: [
              {
                email: params.to,
                name: params.to,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}
