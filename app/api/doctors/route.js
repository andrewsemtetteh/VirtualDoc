import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty');
    const availability = searchParams.get('availability');
    const rating = searchParams.get('rating');
    const search = searchParams.get('search');

    const { db } = await connectToDatabase();
    
    // Build the query based on filters
    let query = { status: 'active' }; // Only show active doctors
    
    if (specialty && specialty !== 'All Specialties') {
      query.specialty = specialty;
    }
    
    if (availability && availability !== 'Any Time') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (availability === 'Today') {
        query.availability = {
          $elemMatch: {
            date: today.toISOString().split('T')[0],
            slots: { $gt: 0 }
          }
        };
      } else if (availability === 'This Week') {
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        query.availability = {
          $elemMatch: {
            date: {
              $gte: today.toISOString().split('T')[0],
              $lte: nextWeek.toISOString().split('T')[0]
            },
            slots: { $gt: 0 }
          }
        };
      }
    }
    
    if (rating && rating !== 'All Ratings') {
      const minRating = parseInt(rating);
      query.rating = { $gte: minRating };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch doctors with their reviews
    const doctors = await db.collection('doctors')
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'doctorId',
            as: 'reviews'
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            specialty: 1,
            profilePicture: 1,
            rating: 1,
            availability: 1,
            reviews: {
              $slice: ['$reviews', 5] // Get only the 5 most recent reviews
            },
            reviewCount: { $size: '$reviews' }
          }
        }
      ])
      .toArray();

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
} 