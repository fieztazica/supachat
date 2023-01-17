import { Button, Center, IconButton } from "@chakra-ui/react";

function SideBarButton({
    isOpen,
    children,
    icon,
    ariaLabel,
    as,
    ...props
  }: {
    icon?: JSX.Element;
    isOpen?: boolean;
    ariaLabel?: string;
    children?: JSX.Element | string;
    as?: any;
    [key: string]: any;
  }) {
    return (
      <>
        {isOpen ? (
          <Button as={as} variant={"ghost"} leftIcon={icon} p={2} {...props}>
            {children}
          </Button>
        ) : (
          <Center>
            <IconButton
              aria-label={ariaLabel!}
              variant={"ghost"}
              icon={icon}
              {...props}
            />
          </Center>
        )}
      </>
    );
  }

  export default SideBarButton