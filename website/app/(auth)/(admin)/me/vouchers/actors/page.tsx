'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllActors, createActor } from '@/actions/voucher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, User, Mail, Phone, QrCode, Wallet } from 'lucide-react';
import { motion } from 'motion/react';

interface Actor {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  vouchers: {
    id: string;
    code: string;
    remainingAmount: number;
    status: string;
  }[];
}

export default function ActorsPage() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
  });

  const fetchActors = async () => {
    setIsLoading(true);
    try {
      const response = await getAllActors();
      if (response.success && response.actors) {
        setActors(response.actors as Actor[]);
      }
    } catch (error) {
      console.error('Error fetching actors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    setIsSubmitting(true);
    try {
      const response = await createActor(formData);
      if (response.success) {
        setFormData({ name: '', email: '', phone: '', bio: '' });
        setShowForm(false);
        fetchActors();
      } else {
        alert(response.message || 'Failed to create actor');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchActors();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100svh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C72C5B]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Actors</h1>
          <p className="mt-1 text-gray-600">Manage actors and influencers</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Actor
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Add New Actor</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+44 123 456 7890"
                  />
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Short biography"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting} className="bg-[#C72C5B]">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Actor'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actors.map((actor) => (
          <motion.div
            key={actor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#C72C5B]/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-[#C72C5B]" />
                  </div>
                  <Badge variant="outline">
                    {actor.vouchers.length} Vouchers
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold mb-1">{actor.name}</h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {actor.email}
                  </div>
                  {actor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {actor.phone}
                    </div>
                  )}
                </div>

                {actor.vouchers.length > 0 && (
                  <div className="border-t pt-4 mb-4">
                    <p className="text-sm font-medium mb-2">Active Balance</p>
                    <p className="text-2xl font-bold text-green-600">
                      £{actor.vouchers
                        .filter(v => v.status === 'ACTIVE')
                        .reduce((sum, v) => sum + v.remainingAmount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href={`/voucher?actor=${actor.id}`} target="_blank" className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <QrCode className="mr-2 h-4 w-4" />
                      View QR
                    </Button>
                  </Link>
                  <Link href={`/me/vouchers/create?actor=${actor.id}`} className="flex-1">
                    <Button className="w-full bg-[#C72C5B]" size="sm">
                      <Wallet className="mr-2 h-4 w-4" />
                      Add Voucher
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {actors.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No actors yet</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Actor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
