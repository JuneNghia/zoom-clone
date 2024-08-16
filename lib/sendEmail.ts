import { UserResource } from '@clerk/types';
import emailjs from '@emailjs/browser';

const sendEmail = (
  user: UserResource | null | undefined,
  onSucess?: () => void,
  onError?: () => void,
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
          onSucess && onSucess();
        },
        (error) => {
          onError && onError();
          console.error(error);
        },
      );
  } else {
    onError && onError();
    console.log(
      'no EMAILJS_SERVICE_ID || EMAILJS_TEMPLATE_ID || EMAILJS_PUBLIC_KEY detected',
    );
  }
};

export default sendEmail;
