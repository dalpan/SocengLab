import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Shield, Award } from 'lucide-react';

export default function ProfilePage() {
    const { t } = useTranslation();
    const username = localStorage.getItem('soceng_username') || 'Agent';

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary">
                    <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{username}</h1>
                    <p className="text-muted-foreground">Security Clearance: Level 1</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-panel p-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <Shield className="w-5 h-5 text-tertiary" />
                        <h3 className="font-bold">Total Scenarios</h3>
                    </div>
                    <p className="text-2xl font-mono">Coming Soon</p>
                </Card>

                <Card className="glass-panel p-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <Award className="w-5 h-5 text-warning" />
                        <h3 className="font-bold">Achievements</h3>
                    </div>
                    <p className="text-2xl font-mono">0</p>
                </Card>
            </div>

            <Card className="glass-panel p-8 text-center">
                <h2 className="text-xl font-bold mb-4">Account Settings</h2>
                <p className="text-muted-foreground mb-6">
                    Advanced profile settings and statistics are under development.
                </p>
                <Button variant="outline" disabled>Edit Profile</Button>
            </Card>
        </div>
    );
}
