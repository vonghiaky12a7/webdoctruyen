// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardBody, Button, User, Tabs, Tab, Input } from "@heroui/react";
import { Edit3, Settings, BookOpen, Star, Check, X } from "lucide-react";
import axios from "axios";
import Image from "next/image";
import ReadingHistory from "@/components/ReadingHistory";
import FavoriteArticles from "@/components/FavoriteArticles";

export default function Profile() {
  const { user: authUser, isLogged } = useAuthStore();
  const { id } = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    avatarPath: "",
  });

  useEffect(() => {
    if (isLogged && id && authUser?.id !== id) {
      console.warn("ID không khớp hoặc không có quyền truy cập");
      router.push("/");
    }
    if (authUser) {
      setEditedUser({
        username: authUser.username,
        email: authUser.email,
        avatarPath: authUser.avatarPath || "",
      });
      console.log("authUser.avatarPath", authUser.avatarPath);
      setPreview(authUser.avatarPath || null);
    }
  }, [id, isLogged, authUser, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      let avatarUrl = editedUser.avatarPath;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
          const uploadRes = await axios.post(
            "http://localhost:8092/users/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
              withCredentials: true,
            }
          );
          avatarUrl = uploadRes.data.url;
        } catch (uploadError) {
          console.error("Lỗi tải ảnh lên:", uploadError);
          alert("Không thể tải ảnh lên! Vui lòng thử lại.");
          return;
        }
      }

      await axios.put(
        `http://localhost:8092/users/${authUser?.id}`,
        {
          ...editedUser,
          avatarPath: avatarUrl,
        },
        { withCredentials: true }
      );

      alert("Cập nhật thành công!");
      setIsEditing(false);
      // Refresh the page to update user data
      router.refresh();
    } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
      alert("Cập nhật thất bại! Vui lòng thử lại.");
    }
  };

  if (!isLogged) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardBody className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mb-2">
              <span className="text-danger text-2xl">!</span>
            </div>
            <h2 className="text-xl font-semibold text-danger">
              Unauthorized Access
            </h2>
            <p className="text-muted-foreground text-center">
              Vui lòng đăng nhập để xem thông tin cá nhân
            </p>
            <Button
              color="primary"
              size="lg"
              className="mt-4 font-semibold"
              onPress={() => router.push("/login")}
            >
              Đăng nhập
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const defaultAvatar = "https://via.placeholder.com/150";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="overflow-hidden bg-zinc-800">
          <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
          <CardBody className="-mt-16 relative">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                {isEditing ? (
                  <label className="cursor-pointer block relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    console.log()
                    <Image
                      src={preview || defaultAvatar}
                      alt="Avatar"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-full border-4 border-white object-cover"                      
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm">Thay đổi</span>
                    </div>
                  </label>
                ) : (
                  <User
                    name={authUser.username}
                    description={authUser.email}
                    avatarProps={{
                      src: authUser.avatarPath || defaultAvatar,
                      size: "lg",
                      isBordered: true,
                      className: "w-24 h-24 text-large",
                    }}
                    className="justify-center"
                  />
                )}
              </div>
              <div className="flex-grow flex flex-col md:flex-row items-center md:items-end justify-between gap-4 mt-4 md:mt-0">
                <div className="text-center md:text-left space-y-2">
                  {isEditing ? (
                    <>
                      <Input
                        name="username"
                        value={editedUser.username}
                        onChange={handleChange}
                        placeholder="Tên người dùng"
                        className="max-w-xs"
                      />
                      <Input
                        name="email"
                        value={editedUser.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="max-w-xs"
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        color="success"
                        variant="flat"
                        startContent={<Check size={18} />}
                        onPress={handleSubmit}
                      >
                        Lưu
                      </Button>
                      <Button
                        color="danger"
                        variant="flat"
                        startContent={<X size={18} />}
                        onPress={() => {
                          setIsEditing(false);
                          setPreview(authUser.avatarPath || null);
                          setEditedUser({
                            username: authUser.username,
                            email: authUser.email,
                            avatarPath: authUser.avatarPath || "",
                          });
                        }}
                      >
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<Edit3 size={18} />}
                      onPress={() => setIsEditing(true)}
                    >
                      Chỉnh sửa thông tin
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Profile Content */}
        <Card>
          <CardBody className="p-0">
            <Tabs
              aria-label="Profile sections"
              color="primary"
              variant="underlined"
              classNames={{
                tabList:
                  "gap-6 w-full relative rounded-none px-6 border-b border-divider",
                cursor: "w-full",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-primary",
              }}
            >
              <Tab
                key="info"
                title={
                  <div className="flex items-center space-x-2">
                    <Settings size={18} />
                    <span>Thông tin cá nhân</span>
                  </div>
                }
              >
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Username
                      </h3>
                      <p className="text-foreground">{authUser.username}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Email
                      </h3>
                      <p className="text-foreground">{authUser.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Vai trò
                      </h3>
                      <p className="text-foreground">
                        {authUser.roleId === 1
                          ? "Admin"
                          : authUser.roleId === 2
                          ? "Editor"
                          : "Reader"}
                      </p>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab
                key="readingHistory"
                title={
                  <div className="flex items-center space-x-2">
                    <BookOpen size={18} />
                    <span>Lịch sử đọc truyện</span>
                  </div>
                }
              >
                <div className="p-6">
                  <ReadingHistory />
                </div>
              </Tab>
              <Tab
                key="favoriteArticles"
                title={
                  <div className="flex items-center space-x-2">
                    <Star size={18} />
                    <span>Bài viết yêu thích</span>
                  </div>
                }
              >
                <div className="p-6">
                  <FavoriteArticles />
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
