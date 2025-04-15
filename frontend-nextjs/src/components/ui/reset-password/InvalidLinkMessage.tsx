import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface InvalidLinkMessageProps {
  errorMessage: string;
  onRequestNewLink: () => void;
}

export const InvalidLinkMessage = ({
  errorMessage,
  onRequestNewLink,
}: InvalidLinkMessageProps) => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
      <div className="flex flex-col gap-1 items-center">
        <Icon
          icon="solar:danger-triangle-bold"
          className="text-danger text-5xl mb-2"
        />
        <h1 className="text-large font-medium">Link Không Hợp Lệ</h1>
        <p className="text-small text-default-500 text-center mt-2">
          {errorMessage}
        </p>
        <Button
          className="w-full bg-primary-500 hover:bg-primary-600 text-white mt-4"
          color="primary"
          onPress={onRequestNewLink}
        >
          Yêu Cầu Link Mới
        </Button>
      </div>
    </div>
  </div>
);
