"use client";
import React from "react";
import { Card, CardBody, Input, Textarea, Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  const handleChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="container bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Contact Us</h1>
          <p className="text-default-500">
            Have questions about our web novel? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardBody className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    placeholder="Your name"
                    value={formData.name}
                    onValueChange={(value) => handleChange(value, "name")}
                    isRequired
                  />
                  <Input
                    label="Email"
                    placeholder="your.email@example.com"
                    type="email"
                    value={formData.email}
                    onValueChange={(value) => handleChange(value, "email")}
                    isRequired
                  />
                </div>
                <Input
                  label="Subject"
                  placeholder="What is this about?"
                  value={formData.subject}
                  onValueChange={(value) => handleChange(value, "subject")}
                  isRequired
                />
                <Textarea
                  label="Message"
                  placeholder="Your message here..."
                  value={formData.message}
                  onValueChange={(value) => handleChange(value, "message")}
                  minRows={4}
                  isRequired
                />
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full md:w-auto"
                >
                  Send Message
                </Button>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Contact Info</h3>
                <div className="space-y-3">
                  <p className="flex items-center gap-2 text-default-500">
                    <Icon icon="lucide:mail" className="text-xl" />
                    contact@webnovel.com
                  </p>
                  <p className="flex items-center gap-2 text-default-500">
                    <Icon icon="lucide:clock" className="text-xl" />
                    Response time: 24-48 hours
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                <div className="flex gap-4">
                  <Link
                    target="blank"
                    href="https://x.com/Vnghak2"
                    className="text-default-500 hover:text-primary"
                  >
                    <Icon icon="mdi:twitter" className="text-2xl" />
                  </Link>
                  <Link
                    target="blank"
                    href="https://www.facebook.com/kyvo1411"
                    className="text-default-500 hover:text-primary"
                  >
                    <Icon icon="mdi:facebook" className="text-2xl" />
                  </Link>
                  <Link
                    target="blank"
                    href="https://www.instagram.com/"
                    className="text-default-500 hover:text-primary"
                  >
                    <Icon icon="mdi:instagram" className="text-2xl" />
                  </Link>
                  <Link
                    target="blank"
                    href="https://discord.com/channels/892683536681820160/894125094979383306"
                    className="text-default-500 hover:text-primary"
                  >
                    <Icon icon="mdi:discord" className="text-2xl" />
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
