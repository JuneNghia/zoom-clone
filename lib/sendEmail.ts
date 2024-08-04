import { UserResource } from '@clerk/types';
import emailjs from '@emailjs/browser';

const sendEmail = (
  user: UserResource | null | undefined,
  onSucess: VoidFunction,
  onError: VoidFunction,
) => {
  if (
    process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID &&
    process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID
  ) {
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID,
        {
          from_name: `${user?.firstName} ${user?.lastName}`,
          to_name: 'Huang Thịnh',
          from_email: user?.primaryEmailAddress?.emailAddress,
          to_email: 'styvenxnguyen2001@gmail.com',
        },
        process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY,
      )
      .then(
        () => {
          onSucess();
        },
        (error) => {
          onError();
          console.error(error);
        },
      );
  } else {
    onError();
    console.log(
      'no EMAILJS_SERVICE_ID || EMAILJS_TEMPLATE_ID || EMAILJS_PUBLIC_KEY detected',
    );
  }
};

export default sendEmail;
