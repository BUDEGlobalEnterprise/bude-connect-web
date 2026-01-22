<template>
  <div class="relative group">
    <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <Card class="relative cursor-pointer transition-all hover:shadow-xl">
      <CardContent class="p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <Badge :variant="status === 'accepted' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'">
                {{ status }}
              </Badge>
              <span class="text-xs text-muted-foreground">#{{ proposalId }}</span>
            </div>
            
            <h3 class="text-lg font-semibold mb-1">{{ freelancerName }}</h3>
            <p class="text-sm text-muted-foreground">{{ title }}</p>
          </div>
          
          <RatingInput :model-value="rating" readonly size="sm" />
        </div>
        
        <p class="text-sm mb-4 line-clamp-2">{{ description }}</p>
        
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p class="text-xs text-muted-foreground">Price</p>
            <p class="font-semibold">${{ price }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Timeline</p>
            <p class="font-semibold">{{ timeline }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Delivered</p>
            <p class="font-semibold">{{ deliveredProjects }}+</p>
          </div>
        </div>
        
        <Separator class="my-4" />
        
        <div class="flex gap-2">
          <Button
            v-if="status === 'pending'"
            variant="default"
            class="flex-1"
            @click="$emit('accept')"
          >
            Accept
          </Button>
          <Button
            v-if="status === 'pending'"
            variant="outline"
            class="flex-1"
            @click="$emit('reject')"
          >
            Decline
          </Button>
          <Button
            variant="outline"
            class="flex-1"
            @click="$emit('message')"
          >
            <MessageCircle class="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button
            variant="ghost"
            size="icon"
            @click="$emit('view')"
          >
            <ExternalLink class="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { RatingInput } from './';
import { MessageCircle, ExternalLink } from 'lucide-vue-next';

interface Props {
  proposalId: string;
  freelancerName: string;
  title: string;
  description: string;
  price: number | string;
  timeline: string;
  rating: number;
  deliveredProjects: number;
  status: 'pending' | 'accepted' | 'rejected';
}

defineProps<Props>();

defineEmits<{
  accept: [];
  reject: [];
  message: [];
  view: [];
}>();
</script>
