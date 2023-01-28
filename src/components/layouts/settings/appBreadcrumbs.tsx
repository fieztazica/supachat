import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";

const convertBreadcrumb = (string: string) => {
  string = string
    .replace(/-/g, " ")
    .replace(/oe/g, "ö")
    .replace(/ae/g, "ä")
    .replace(/ue/g, "ü");
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function AppBreadcrumbs({ ...props }) {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<
    { breadcrumb: string; href: string }[] | null
  >(null);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split("/");
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return {
          breadcrumb: path,
          href: "/" + linkPath.slice(0, i + 1).join("/"),
        };
      });

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  return (
    <Breadcrumb {...props}>
      {breadcrumbs?.map((breadcrumb, i) => {
        return (
          <BreadcrumbItem key={breadcrumb.href}>
            <BreadcrumbLink as={NextLink} href={breadcrumb.href}>
              <Text>{convertBreadcrumb(breadcrumb.breadcrumb)}</Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}

export default AppBreadcrumbs;
