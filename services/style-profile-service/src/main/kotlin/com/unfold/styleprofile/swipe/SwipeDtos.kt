package com.unfold.styleprofile.swipe

import jakarta.validation.constraints.NotBlank
import java.time.Instant
import java.util.UUID

data class RecordSwipeRequest(
    @field:NotBlank val userId: String,
    @field:NotBlank val filename: String,
    @field:NotBlank val style: String,
    val direction: SwipeDirection,
)

data class SwipeResponse(
    val id: UUID?,
    val userId: String,
    val filename: String,
    val style: String,
    val direction: SwipeDirection,
    val createdAt: Instant,
) {
    companion object {
        fun from(swipe: Swipe) = SwipeResponse(
            id = swipe.id,
            userId = swipe.userId,
            filename = swipe.filename,
            style = swipe.style,
            direction = swipe.direction,
            createdAt = swipe.createdAt,
        )
    }
}

data class StyleWeight(
    val style: String,
    val count: Long,
    val weight: Double,
)

data class StyleProfileResponse(
    val userId: String,
    val totalSwipes: Long,
    val totalLikes: Long,
    val hasMinimumSwipes: Boolean,
    val profile: List<StyleWeight>,
)
