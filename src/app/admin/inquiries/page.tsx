import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

async function getInquiries() {
    const inquiries = await prisma.corporateInquiry.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return inquiries;
}

export default async function AdminInquiriesPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const inquiries = await getInquiries();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "NEW":
                return "bg-blue-500 hover:bg-blue-600";
            case "CONTACTED":
                return "bg-yellow-500 hover:bg-yellow-600";
            case "CLOSED":
                return "bg-green-500 hover:bg-green-600";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Corporate Inquiries</h1>
                <p className="text-muted-foreground">
                    Manage bulk order requests from companies.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Inquiries ({inquiries.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inquiries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                        No inquiries found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                inquiries.map((inquiry) => (
                                    <TableRow key={inquiry.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(inquiry.createdAt), "PP")}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {inquiry.company}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{inquiry.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {inquiry.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{inquiry.product}</TableCell>
                                        <TableCell>{inquiry.quantity}</TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={inquiry.message || ""}>
                                            {inquiry.message || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(inquiry.status)}>
                                                {inquiry.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
