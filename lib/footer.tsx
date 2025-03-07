import { Container, Grid, Text, Link } from '@/components/ui/textarea';
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <Container className="max-w-7xl mx-auto px-4">
        <Grid className="grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Text className="text-lg font-bold mb-2">About Us</Text>
            <Text className="text-gray-600">
              We&apos;re excited to celebrate the upcoming arrival of our little one!
            </Text>
          </div>
          <div>
            <Text className="text-lg font-bold mb-2">Quick Links</Text>
            <ul>
              <li>
                <Link href="/guess-the-baby" className="text-gray-600 hover:text-gray-900">
                  Guess the Baby
                </Link>
              </li>
              <li>
                <Link href="/leave-a-note" className="text-gray-600 hover:text-gray-900">
                  Leave a Note
                </Link>
              </li>
              <li>
                <Link href="/registry" className="text-gray-600 hover:text-gray-900">
                  Registry
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <Text className="text-lg font-bold mb-2">Contact Us</Text>
            <Text className="text-gray-600">
              Email: [example@email.com](mailto:example@email.com)
            </Text>
            <Text className="text-gray-600">
              Phone: 555-555-5555
            </Text>
          </div>
        </Grid>
        <Text className="text-gray-600 text-center mt-4">
          &copy; 2023 Baby Shower Registry. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
};

export default Footer;
