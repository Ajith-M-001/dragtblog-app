/* eslint-disable react/prop-types */

import { Box, Container, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

const BlogComponent = ({ content }) => {
  const theme = useTheme();

  const renderBlock = (block) => {
    console.log(block);
    switch (block.type) {
      case "paragraph": {
        return (
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{ __html: block.data.text }}
          />
        );
      }
      case "header": {
        const HeaderTag = `h${block.data.level}`;
        return <HeaderTag>{block.data.text}</HeaderTag>;
      }
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
      case "link":
        return <Link href={block.data.link}>{block.data.link}</Link>;
      case "quote":
        return (
          <Box
            my={theme.spacing(3)}
            key={block.id}
            sx={{
              position: "relative",
              backgroundColor: theme.palette.background.default,
              borderLeft: `6px solid ${theme.palette.primary.main}`,
              borderRadius: "4px",
              padding: theme.spacing(3),
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              fontStyle: "italic", // Italicize the quote
              color: theme.palette.text.primary,
              "&:before": {
                content: '"“"',
                position: "absolute",
                top: "-10px",
                left: "-10px",
                fontSize: "50px",
                color: theme.palette.primary.main,
                opacity: 0.1, // Slight opacity for decorative quotation mark
              },
            }}
          >
            <Typography
              variant="body1"
              component="blockquote"
              sx={{
                fontSize: "1.2rem", // Slightly larger font for quotes
                lineHeight: 1.6,
                textAlign: block.data.alignment || "left", // Default to left alignment
              }}
            >
              {block.data.text}
            </Typography>

            {block.data.caption && (
              <Typography
                sx={{
                  mt: theme.spacing(2),
                  textAlign: "right",
                  fontSize: "0.9rem",
                  fontStyle: "normal", // Normal text for caption
                  color: theme.palette.text.secondary,
                }}
                variant="caption"
                display="block"
                gutterBottom
              >
                — {block.data.caption}
              </Typography>
            )}
          </Box>
        );

      case "list": {
        const ListTag = block.data.style === "ordered" ? "ol" : "ul"; // Determine the list type
        return (
          <Box key={block.id} my={theme.spacing(2)}>
            <ListTag>
              {block.data.items.map((item, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: item }} /> // Render list items
              ))}
            </ListTag>
          </Box>
        );
      }
      case "table": {
        return (
          <Box key={block.id} my={theme.spacing(2)}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {block.data.content.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{ border: "1px solid #ccc", padding: "8px" }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        );
      }
      case "code": {
        return (
          <Box key={block.id} my={theme.spacing(2)}>
            <pre
              style={{
                backgroundColor: theme.palette.background.paper, // Use theme background
                color: theme.palette.text.primary, // Use theme text color
                padding: "10px",
                borderRadius: "4px",
                overflowX: "auto", // Allow horizontal scrolling for long lines
              }}
            >
              <code>{block.data.code}</code>
            </pre>
          </Box>
        );
      }
      case "delimiter": {
        return (
          <Box key={block.id} my={theme.spacing(2)}>
            <hr
              style={{
                border: "1px solid",
                borderColor: theme.palette.divider,
              }}
            />
          </Box>
        );
      }
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      {content && content.blocks && content.blocks.length > 0
        ? content.blocks.map((block) => (
            <div key={block.id}>{renderBlock(block)}</div>
          ))
        : null}
    </Container>
  );
};

export default BlogComponent;
