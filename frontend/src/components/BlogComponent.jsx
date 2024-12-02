/* eslint-disable react/prop-types */

import { Box, Container, Typography, useTheme } from "@mui/material";

const BlogComponent = ({ content }) => {
  const theme = useTheme();
  const renderBlock = (block) => {
    console.log(block);
    switch (block.type) {
      case "paragraph":
        return <Typography variant="body1">{block.data.text}</Typography>;
      case "header":
        const HeaderTag = `h${block.data.level}`;
        return <HeaderTag>{block.data.text}</HeaderTag>;
      case "image":
        return (
          <Box key={block.id} my={theme.spacing(2)}>
            <img
              src={block.data.file.url}
              alt={block.data.caption || "image"}
              style={{
                maxWidth: "100%",
                borderRadius: theme.shape.borderRadius,
              }}
            />
            {block.data.caption && (
              <Typography variant="caption" display="block" gutterBottom>
                {block.data.caption}
              </Typography>
            )}
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="md">
      {content.blocks.length > 0
        ? content.blocks.map((block) => renderBlock(block))
        : null}
    </Container>
  );
};

export default BlogComponent;
