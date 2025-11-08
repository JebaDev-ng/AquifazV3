import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { requireEditor, logActivity } from '@/lib/admin/auth'
import {
  DEFAULT_HOMEPAGE_SETTINGS,
  HOMEPAGE_SETTINGS_ID,
} from '@/lib/content'
import { readLocalHomepageSettings, writeLocalHomepageSettings } from '@/lib/homepage-settings'
import { hasSupabaseConfig } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'
import type { HomepageSettings } from '@/lib/types'

const settingsSchema = z.object({
  use_mock_data: z.boolean(),
})

const hasSupabase = hasSupabaseConfig()

export async function GET() {
  try {
    await requireEditor()

    if (!hasSupabase) {
      const settings = await readLocalHomepageSettings()
      return NextResponse.json(settings)
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('content_sections')
      .select('data')
      .eq('id', HOMEPAGE_SETTINGS_ID)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar configurações da homepage:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const settings = {
      ...DEFAULT_HOMEPAGE_SETTINGS,
      use_mock_data: data?.data?.use_mock_data ?? DEFAULT_HOMEPAGE_SETTINGS.use_mock_data,
    }

    return NextResponse.json(settings)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno ao carregar as configurações'
    console.error('Erro na API de configurações da homepage:', error)
    const fallback = await readLocalHomepageSettings()
    return NextResponse.json(fallback, { status: 200 })
  }
}

export async function PUT(request: NextRequest) {
  let desiredSettings: HomepageSettings | null = null
  try {
    await requireEditor()
    const body = await request.json()
    const validatedData = settingsSchema.parse(body)
    desiredSettings = {
      ...DEFAULT_HOMEPAGE_SETTINGS,
      ...validatedData,
    }

    if (!hasSupabase) {
      await writeLocalHomepageSettings(desiredSettings)
      return NextResponse.json(desiredSettings)
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: currentSettings } = await supabase
      .from('content_sections')
      .select('*')
      .eq('id', HOMEPAGE_SETTINGS_ID)
      .maybeSingle()

    const contentData = {
      id: HOMEPAGE_SETTINGS_ID,
      type: 'settings' as const,
      title: 'Homepage Settings',
      subtitle: null,
      description: null,
      image_url: null,
      data: {
        use_mock_data: validatedData.use_mock_data,
      },
      active: true,
      sort_order: 0,
      updated_at: new Date().toISOString(),
      updated_by: user?.id,
    }

    let upserted
    if (currentSettings) {
      const { data, error } = await supabase
        .from('content_sections')
        .update(contentData)
        .eq('id', HOMEPAGE_SETTINGS_ID)
        .select()
        .single()

      if (error) throw error
      upserted = data
    } else {
      const { data, error } = await supabase
        .from('content_sections')
        .insert({
          ...contentData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      upserted = data
    }

    await logActivity(
      'content_updated',
      'content_section',
      HOMEPAGE_SETTINGS_ID,
      currentSettings,
      upserted,
    )

    return NextResponse.json(desiredSettings)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 },
      )
    }

    const message = error instanceof Error ? error.message : 'Erro interno ao salvar as configurações'
    console.error('Erro ao atualizar configurações da homepage:', error)
    if (desiredSettings) {
      await writeLocalHomepageSettings(desiredSettings)
      return NextResponse.json(desiredSettings)
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
