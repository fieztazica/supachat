import Head from "next/head";

const Meta = ({
  title,
  keywords,
  description,
  image,
  isAlone = false,
}: any) => {
  const displayTitle = isAlone ? title : title.concat(" | Fiezt");
  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />
      {/* <link
        rel="stylesheet"
        href="https://s.pageclip.co/v1/pageclip.css"
        media="screen"
      /> */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta property="og:title" content={displayTitle} />
      <meta property="og:image" content={image} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={displayTitle} />
      <meta name="twitter:title" content={displayTitle} />
      <meta name="twitter:description" content={description} />
      {image && (
        <>
          <meta name="twitter:image" content={image} />
          <meta name="twitter:card" content="summary_large_image" />
        </>
      )}
      <title>{displayTitle}</title>
    </Head>
  );
};

export default Meta;
