'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createVoucher, getAllActors, createActor } from '@/actions/voucher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

interface Actor {
  id: string;
  name: string;
  email: string;
}

export default function CreateVoucherPage() {
  const router = useRouter();
  const [actors, setActors] = useState<Actor[]>([]);
  const [isLoadingActors, setIsLoadingActors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewActorForm, setShowNewActorForm] = useState(false);
  
  const [formData, setFormData] = useState({
    actorId: '',
    totalAmount: '',
    clientPassword: '',
    description: '',
    projectName: '',
  });
  
  const [newActor, setNewActor] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    try {
      const response = await getAllActors();
      if (response.success && response.actors) {
        setActors(response.actors as Actor[]);
      }
    } catch (error) {
      console.error('Error fetching actors:', error);
    } finally {
      setIsLoadingActors(false);
    }
  };

  const handleCreateActor = async () => {
    if (!newActor.name || !newActor.email) return;
    
    try {
      const response = await createActor(newActor);
      if (response.success && response.actor) {
        setActors([...actors, response.actor as Actor]);
        setFormData({ ...formData, actorId: (response.actor as Actor).id });
        setShowNewActorForm(false);
        setNewActor({ name: '', email: '', phone: '', bio: '' });
      } else {
        alert(response.message || 'Failed to create actor');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.actorId || !formData.totalAmount || !formData.clientPassword) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await createVoucher({
        actorId: formData.actorId,
        totalAmount: parseFloat(formData.totalAmount),
        clientPassword: formData.clientPassword,
        description: formData.description,
        projectName: formData.projectName,
      });
      
      if (response.success) {
        router.push('/me/vouchers');
      } else {
        alert(response.message || 'Failed to create voucher');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while creating the voucher');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Voucher</h1>
        <p className="mt-1 text-gray-600">Create a new voucher for an actor</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Actor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingActors ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading actors...
                </div>
              ) : (
                <>
                  <Select
                    value={formData.actorId}
                    onValueChange={(value) => setFormData({ ...formData, actorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an actor" />
                    </SelectTrigger>
                    <SelectContent>
                      {actors.map((actor) => (
                        <SelectItem key={actor.id} value={actor.id}>
                          {actor.name} ({actor.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewActorForm(!showNewActorForm)}
                    className="w-full"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {showNewActorForm ? 'Cancel' : 'Add New Actor'}
                  </Button>
                </>
              )}
              
              {showNewActorForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3 pt-4 border-t"
                >
                  <h4 className="font-medium">New Actor Details</h4>
                  <Input
                    placeholder="Name *"
                    value={newActor.name}
                    onChange={(e) => setNewActor({ ...newActor, name: e.target.value })}
                  />
                  <Input
                    placeholder="Email *"
                    type="email"
                    value={newActor.email}
                    onChange={(e) => setNewActor({ ...newActor, email: e.target.value })}
                  />
                  <Input
                    placeholder="Phone"
                    value={newActor.phone}
                    onChange={(e) => setNewActor({ ...newActor, phone: e.target.value })}
                  />
                  <Textarea
                    placeholder="Bio"
                    value={newActor.bio}
                    onChange={(e) => setNewActor({ ...newActor, bio: e.target.value })}
                    rows={2}
                  />
                  <Button
                    type="button"
                    onClick={handleCreateActor}
                    disabled={!newActor.name || !newActor.email}
                  >
                    Create Actor
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voucher Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Total Amount (£) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Client Access Password *</Label>
                <Input
                  id="password"
                  type="text"
                  value={formData.clientPassword}
                  onChange={(e) => setFormData({ ...formData, clientPassword: e.target.value })}
                  placeholder="Password for vendor to access voucher"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This password will be shared with vendors to update spending
                </p>
              </div>
              
              <div>
                <Label htmlFor="project">Project Name</Label>
                <Input
                  id="project"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g., Summer Campaign 2024"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional notes about this voucher"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/me/vouchers')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#C72C5B] hover:bg-[#A3244A]"
              disabled={isSubmitting || !formData.actorId || !formData.totalAmount || !formData.clientPassword}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Voucher
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
