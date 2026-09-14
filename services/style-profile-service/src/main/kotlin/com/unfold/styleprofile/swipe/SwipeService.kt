package com.unfold.styleprofile.swipe

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SwipeService(private val swipeRepository: SwipeRepository) {

    companion object {
        const val MINIMUM_SWIPES = 20
    }

    @Transactional
    fun recordSwipe(request: RecordSwipeRequest): SwipeResponse {
        val swipe = Swipe(
            userId = request.userId,
            filename = request.filename,
            style = request.style,
            direction = request.direction,
        )
        return SwipeResponse.from(swipeRepository.save(swipe))
    }

    @Transactional(readOnly = true)
    fun getStyleProfile(userId: String): StyleProfileResponse {
        val totalSwipes = swipeRepository.countByUserId(userId)
        val likes = swipeRepository.findAllByUserIdAndDirection(userId, SwipeDirection.RIGHT)
        val totalLikes = likes.size.toLong()

        val counts = likes.groupingBy { it.style }.eachCount()
        val profile = counts.entries
            .map { (style, count) ->
                StyleWeight(
                    style = style,
                    count = count.toLong(),
                    weight = if (totalLikes == 0L) 0.0 else count.toDouble() / totalLikes,
                )
            }
            .sortedByDescending { it.weight }

        return StyleProfileResponse(
            userId = userId,
            totalSwipes = totalSwipes,
            totalLikes = totalLikes,
            hasMinimumSwipes = totalSwipes >= MINIMUM_SWIPES,
            profile = profile,
        )
    }
}
