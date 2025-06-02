import { GetStaticProps } from 'next';
import { Box, Typography } from '@mui/material';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default function Custom404() {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4">404 - ページが見つかりません</Typography>
    </Box>
  );
}