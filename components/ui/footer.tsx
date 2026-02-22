import { Logo } from './logo';

export default function Footer() {
    return (
        <footer className="bg-muted/50 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <Logo variant="footer" />
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        © 2026 unpacked. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <span className="text-sm text-muted-foreground">Made with ❤️ for fashion lovers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
} 