package com.unfold.styleprofile.swipe

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SwipeRepository : JpaRepository<Swipe, UUID> {
    fun findAllByUserIdAndDirection(userId: String, direction: SwipeDirection): List<Swipe>

    fun countByUserId(userId: String): Long
}
