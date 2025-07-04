"use client";
import { cn } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useState } from "react"; // Import useState hook
import { sendEmail } from "@/actions/sendEmail"; // Import the server action

// Define the Zod schema for attachment data
const attachmentSchema = z.object({
    filename: z.string(),
    content: z.string(), // Base64 string
    contentType: z.string(), // MIME type
});

// Define the Zod schema for form validation, now including optional attachments
const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }), // Email validation
    message: z.string().min(2, { message: "Message must be at least 2 characters." }), // Message length validation
    attachments: z.array(attachmentSchema).optional(), // Optional array of attachments
})

// Define the LoginForm component
export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const [submissionMessage, setSubmissionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null); // State for submission message
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // State to hold selected File objects

    // Initialize react-hook-form with Zod resolver
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), // Connects Zod schema to react-hook-form
        defaultValues: {
            email: "", // Default empty string for email
            message: "", // Default empty string for message
            attachments: [], // Initialize attachments as an empty array
        },
    })

    // Handler for file input change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            // Basic file size check (e.g., 5MB limit per file)
            const maxFileSize = 5 * 1024 * 1024; // 5 MB
            const validFiles = filesArray.filter(file => {
                if (file.size > maxFileSize) {
                    setSubmissionMessage({ type: 'error', text: `File "${file.name}" is too large (max 5MB).` });
                    return false;
                }
                return true;
            });
            setSelectedFiles(validFiles);
            setSubmissionMessage(null); // Clear previous file size errors
        }
    };

    // Function to handle form submission
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true); // Set loading to true when submission starts
        setSubmissionMessage(null); // Clear previous messages

        let attachmentsToSend: { filename: string; content: string; contentType: string }[] = [];

        // Process selected files into Base64
        if (selectedFiles.length > 0) {
            const filePromises = selectedFiles.map(file => {
                return new Promise<z.infer<typeof attachmentSchema>>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        // Extract base64 string (remove data:image/png;base64, prefix)
                        const base64Content = (reader.result as string).split(',')[1];
                        resolve({
                            filename: file.name,
                            content: base64Content,
                            contentType: file.type,
                        });
                    };
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(file); // Read file as Data URL (Base64)
                });
            });

            try {
                attachmentsToSend = await Promise.all(filePromises);
                // Update form values with attachments before sending
                // This line is optional for the server action but keeps form state consistent
                form.setValue("attachments", attachmentsToSend);
            } catch (fileError) {
                console.error("Error reading files:", fileError);
                setSubmissionMessage({ type: 'error', text: "Failed to read one or more files." });
                setIsLoading(false);
                return; // Stop submission if file reading fails
            }
        }

        try {
            // Call the server action to send the email, including attachments
            const result = await sendEmail({
                email: values.email,
                message: values.message,
                attachments: attachmentsToSend, // Pass the processed attachments
            });

            if (result.success) {
                setSubmissionMessage({ type: 'success', text: result.message });
                form.reset(); // Clear form fields on success
                setSelectedFiles([]); // Clear selected files state
            } else {
                setSubmissionMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmissionMessage({ type: 'error', text: "An unexpected error occurred." });
        } finally {
            setIsLoading(false); // Set loading to false after submission attempt
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="rounded-xl shadow-lg"> {/* Added rounded corners and shadow for better aesthetics */}
                <CardHeader className="p-6">
                    <CardTitle className="text-2xl font-bold text-gray-800">Email and Message</CardTitle>
                    <CardDescription className="text-gray-600">
                        Enter your email and your message below. We will get back to you as soon as possible.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    {/* Form component from shadcn/ui, connected to react-hook-form instance */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> {/* Added space-y-6 for consistent vertical spacing */}
                            {/* FormField for Email Input */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" // Styled input
                                                {...field} // Binds input to react-hook-form
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm" /> {/* Displays validation errors */}
                                    </FormItem>
                                )}
                            />

                            {/* FormField for Message Textarea */}
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 font-medium">Your Message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                id="message"
                                                placeholder="Type your message here."
                                                className="min-h-[100px] rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" // Styled textarea
                                                {...field} // Binds textarea to react-hook-form
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm" /> {/* Displays validation errors */}
                                    </FormItem>
                                )}
                            />

                            {/* File Attachment Input */}
                            <FormItem>
                                <FormLabel className="text-gray-700 font-medium">Attachments (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        id="attachments"
                                        type="file"
                                        multiple // Allow multiple file selection
                                        onChange={handleFileChange}
                                        className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" // Styled file input
                                    />
                                </FormControl>
                                {selectedFiles.length > 0 && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Selected files: {selectedFiles.map(file => file.name).join(', ')}
                                    </div>
                                )}
                                <FormMessage className="text-red-500 text-sm" />
                                <p className="text-sm text-gray-500">Max file size per attachment: 5MB. Total email size limits apply.</p>
                            </FormItem>


                            {/* Submission Message Display */}
                            {submissionMessage && (
                                <div
                                    className={cn(
                                        "p-3 rounded-md text-sm",
                                        submissionMessage.type === 'success' ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                                    )}
                                >
                                    {submissionMessage.text}
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 shadow-md" // Styled button
                                disabled={isLoading} // Disable button when loading
                            >
                                {isLoading ? "Sending..." : "Submit"} {/* Change button text based on loading state */}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
